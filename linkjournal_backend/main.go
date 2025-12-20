package main

import (
	"context"
	"fmt"
	"log"
	"net/http"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"
)

// Mongo Global
var DB *mongo.Database

// Note: FirebaseApp, AuthClient, and InitFirebase are in firebase.go
// Note: AuthMiddleware is in auth_middleware.go

// ======================= MODELS =========================

type Topic struct {
	ID        primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID    string             `bson:"user_id" json:"user_id"`
	Name      string             `bson:"name" json:"name"`
	CreatedAt time.Time          `bson:"created_at" json:"created_at"`
}

type LinkJournal struct {
	ID          primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	UserID      string             `bson:"user_id" json:"user_id"`
	TopicID     primitive.ObjectID `bson:"topic_id" json:"topic_id"`
	Name        string             `bson:"name" json:"name"`
	Link        string             `bson:"link" json:"link"`
	Description string             `bson:"description,omitempty" json:"description,omitempty"`
	Screenshot  string             `bson:"screenshot,omitempty" json:"screenshot,omitempty"`
	IsImportant bool               `bson:"is_important" json:"is_important"`
	CreatedAt   time.Time          `bson:"created_at" json:"created_at"`
}

type User struct {
	ID             primitive.ObjectID `bson:"_id,omitempty" json:"id,omitempty"`
	FirebaseUID    string             `bson:"firebase_uid" json:"firebase_uid"`
	Email          string             `bson:"email" json:"email"`
	DisplayName    string             `bson:"display_name" json:"display_name"`
	ProfilePicture string             `bson:"profile_picture" json:"profile_picture"`
	CreatedAt      time.Time          `bson:"created_at" json:"created_at"`
}

// ======================= CORS MIDDLEWARE =========================

// 🔥 This fixes your CORS error by allowing requests from localhost:3000
func CORSMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {

		// Replace "http://localhost:3000" with "*" if you want to allow ANY frontend to connect
		c.Writer.Header().Set("Access-Control-Allow-Origin", "*")
		c.Writer.Header().Set("Access-Control-Allow-Credentials", "true")
		c.Writer.Header().Set("Access-Control-Allow-Headers", "Content-Type, Content-Length, Accept-Encoding, X-CSRF-Token, Authorization, accept, origin, Cache-Control, X-Requested-With")
		c.Writer.Header().Set("Access-Control-Allow-Methods", "POST, OPTIONS, GET, PUT, DELETE")

		// Handle the Browser's Preflight OPTIONS request
		if c.Request.Method == "OPTIONS" {
			c.AbortWithStatus(204)
			return
		}

		c.Next()
	}
}

// ======================= USER PROFILE CONTROLLER =========================
func CreateUser(c *gin.Context, col *mongo.Collection) {
	var body struct {
		FirebaseUID string `json:"firebase_uid"`
		Email       string `json:"email"`
		DisplayName string `json:"display_name"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	// Check if user already exists
	count, _ := col.CountDocuments(context.TODO(), bson.M{"firebase_uid": body.FirebaseUID})
	if count > 0 {
		c.JSON(http.StatusConflict, gin.H{"message": "User already exists"})
		return
	}

	newUser := User{
		ID:             primitive.NewObjectID(),
		FirebaseUID:    body.FirebaseUID,
		Email:          body.Email,
		DisplayName:    body.DisplayName,
		ProfilePicture: "", // Placeholder for later
		CreatedAt:      time.Now(),
	}

	_, err := col.InsertOne(context.TODO(), newUser)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to save user"})
		return
	}

	c.JSON(http.StatusCreated, newUser)
}

// GetUserProfile: Uses the UID from the AuthMiddleware
func GetUserProfile(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid") // Taken from AuthMiddleware

	var user User
	err := col.FindOne(context.TODO(), bson.M{"firebase_uid": uid}).Decode(&user)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "User profile not found"})
		return
	}

	c.JSON(http.StatusOK, user)
}

// UpdateProfilePicture: Updates the user's profile image URL
func UpdateProfilePicture(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid") // Taken from AuthMiddleware

	var body struct {
		ProfilePicture string `json:"profile_picture"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	if body.ProfilePicture == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Profile picture URL is required"})
		return
	}

	// Update the profile_picture field in MongoDB for this Firebase UID
	filter := bson.M{"firebase_uid": uid}
	update := bson.M{"$set": bson.M{"profile_picture": body.ProfilePicture}}

	result, err := col.UpdateOne(context.TODO(), filter, update)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update profile picture"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "User not found"})
		return
	}

	c.JSON(http.StatusOK, gin.H{
		"message":         "Profile picture updated successfully",
		"profile_picture": body.ProfilePicture,
	})
}

// ======================= TOPIC CONTROLLERS =========================

// Create Topic (Uses Firebase UID)
func CreateTopic(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid")

	var body struct {
		Name string `json:"name"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	if body.Name == "" {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Topic Name is required"})
		return
	}

	topic := Topic{
		ID:        primitive.NewObjectID(),
		UserID:    uid,
		Name:      body.Name,
		CreatedAt: time.Now(),
	}

	_, err := col.InsertOne(context.TODO(), topic)
	if err != nil {
		fmt.Printf("❌ MongoDB Topic Insert Error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Error: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, topic)
}

func GetUserTopics(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid")

	cursor, err := col.Find(context.TODO(), bson.M{"user_id": uid})
	if err != nil {
		fmt.Printf("❌ MongoDB Find Error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching topics"})
		return
	}

	var topics []Topic = []Topic{} // Initialize empty slice
	if err = cursor.All(context.TODO(), &topics); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing topics"})
		return
	}

	c.JSON(http.StatusOK, topics)
}

// Get topic name by ID
func GetTopicByID(c *gin.Context, col *mongo.Collection) {
	idHex := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Topic ID format"})
		return
	}

	var topic Topic
	err = col.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&topic)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found"})
		return
	}

	// Returning just the name as requested, but you could return the whole object
	c.JSON(http.StatusOK, gin.H{"name": topic.Name})
}

// Update Topic Name
func UpdateTopic(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid")
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var body struct {
		Name string `json:"name"`
	}
	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid request body"})
		return
	}

	// Update only if it belongs to the user
	result, err := col.UpdateOne(
		context.TODO(),
		bson.M{"_id": id, "user_id": uid},
		bson.M{"$set": bson.M{"name": body.Name}},
	)

	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update topic"})
		return
	}

	if result.MatchedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found or unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Topic updated successfully"})
}

// Delete Topic
func DeleteTopic(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid")
	id, err := primitive.ObjectIDFromHex(c.Param("id"))
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	// Delete the topic only if it belongs to the user
	result, err := col.DeleteOne(context.TODO(), bson.M{"_id": id, "user_id": uid})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete topic"})
		return
	}

	if result.DeletedCount == 0 {
		c.JSON(http.StatusNotFound, gin.H{"error": "Topic not found or unauthorized"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Topic deleted successfully"})
}

// ======================= JOURNAL CONTROLLERS =========================

func CreateJournal(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid")

	var body struct {
		TopicID     string `json:"topic_id"`
		Name        string `json:"name"`
		Link        string `json:"link"`
		Description string `json:"description"`
		Screenshot  string `json:"screenshot"`
	}

	if err := c.ShouldBindJSON(&body); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	topicObjID, err := primitive.ObjectIDFromHex(body.TopicID)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid topic_id format"})
		return
	}

	journal := LinkJournal{
		ID:          primitive.NewObjectID(),
		UserID:      uid,
		TopicID:     topicObjID,
		Name:        body.Name,
		Link:        body.Link,
		Description: body.Description,
		Screenshot:  body.Screenshot,
		IsImportant: false,
		CreatedAt:   time.Now(),
	}

	_, err = col.InsertOne(context.TODO(), journal)
	if err != nil {
		fmt.Printf("❌ MongoDB Journal Insert Error: %v\n", err)
		c.JSON(http.StatusInternalServerError, gin.H{"error": "DB Error: " + err.Error()})
		return
	}

	c.JSON(http.StatusCreated, journal)
}

func GetUserJournals(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid")

	cursor, err := col.Find(context.TODO(), bson.M{"user_id": uid})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching journals"})
		return
	}

	var journals []LinkJournal = []LinkJournal{}
	cursor.All(context.TODO(), &journals)
	c.JSON(http.StatusOK, journals)
}

func GetJournalByID(c *gin.Context, col *mongo.Collection) {
	idHex := c.Param("id")
	id, err := primitive.ObjectIDFromHex(idHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid ID format"})
		return
	}

	var j LinkJournal
	err = col.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&j)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Journal not found"})
		return
	}

	c.JSON(http.StatusOK, j)
}

func UpdateJournal(c *gin.Context, col *mongo.Collection) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	var updates bson.M
	if err := c.ShouldBindJSON(&updates); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}

	_, err := col.UpdateByID(context.TODO(), id, bson.M{"$set": updates})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to update"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated successfully"})
}

func DeleteJournal(c *gin.Context, col *mongo.Collection) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	_, err := col.DeleteOne(context.TODO(), bson.M{"_id": id})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to delete"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Deleted"})
}

func ToggleImportant(c *gin.Context, col *mongo.Collection) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))

	var journal LinkJournal
	err := col.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&journal)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Journal not found"})
		return
	}

	newVal := !journal.IsImportant

	_, err = col.UpdateByID(context.TODO(), id, bson.M{"$set": bson.M{"is_important": newVal}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to toggle importance"})
		return
	}

	c.JSON(http.StatusOK, gin.H{"message": "Updated importance", "isImportant": newVal})
}

// NEW: Get all journals for a specific topic
func GetJournalsByTopic(c *gin.Context, col *mongo.Collection) {
	uid := c.GetString("uid")
	topicIdHex := c.Param("id")

	topicObjID, err := primitive.ObjectIDFromHex(topicIdHex)
	if err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": "Invalid Topic ID format"})
		return
	}

	// Filter by both topic_id AND user_id for security
	filter := bson.M{
		"topic_id": topicObjID,
		"user_id":  uid,
	}

	cursor, err := col.Find(context.TODO(), filter)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching journals for this topic"})
		return
	}

	var journals []LinkJournal = []LinkJournal{}
	if err = cursor.All(context.TODO(), &journals); err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error parsing journals"})
		return
	}

	c.JSON(http.StatusOK, journals)
}
// ======================= ROUTES =========================

func TopicRoutes(r *gin.Engine, db *mongo.Database) {
	col := db.Collection("topics")
	journalCol := db.Collection("journals") // Need journals collection for the nested route
	r.POST("/api/topics", AuthMiddleware(), func(c *gin.Context) { CreateTopic(c, col) })
	r.GET("/api/topics", AuthMiddleware(), func(c *gin.Context) { GetUserTopics(c, col) })
	r.GET("/api/topics/:id", AuthMiddleware(), func(c *gin.Context) { GetTopicByID(c, col) })
	r.PUT("/api/topics/:id", AuthMiddleware(), func(c *gin.Context) { UpdateTopic(c, col) })
	r.DELETE("/api/topics/:id", AuthMiddleware(), func(c *gin.Context) { DeleteTopic(c, col) })
	r.GET("/api/topics/:id/journals", AuthMiddleware(), func(c *gin.Context) { GetJournalsByTopic(c, journalCol) })

}

func JournalRoutes(r *gin.Engine, db *mongo.Database) {
	col := db.Collection("journals")

	r.POST("/api/journals", AuthMiddleware(), func(c *gin.Context) { CreateJournal(c, col) })
	r.GET("/api/journals", AuthMiddleware(), func(c *gin.Context) { GetUserJournals(c, col) })
	r.GET("/api/journal/:id", AuthMiddleware(), func(c *gin.Context) { GetJournalByID(c, col) })
	r.PUT("/api/journal/:id", AuthMiddleware(), func(c *gin.Context) { UpdateJournal(c, col) })
	r.DELETE("/api/journal/:id", AuthMiddleware(), func(c *gin.Context) { DeleteJournal(c, col) })
	r.PUT("/api/journal/:id/important", AuthMiddleware(), func(c *gin.Context) { ToggleImportant(c, col) })
}

func UserRoutes(r *gin.Engine, db *mongo.Database) {
	col := db.Collection("users")

	// Endpoint to save user data after signup (public or auth-protected depending on flow)
	r.POST("/api/users/signup", func(c *gin.Context) { CreateUser(c, col) })

	// Endpoint to get current user info (protected)
	r.GET("/api/users/me", AuthMiddleware(), func(c *gin.Context) { GetUserProfile(c, col) })
	r.PUT("/api/users/profile-picture", AuthMiddleware(), func(c *gin.Context) { UpdateProfilePicture(c, col) })
}
// ======================= MAIN =========================

func main() {
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ .env not found")
	}

	// Connect MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	mongoURI := os.Getenv("MONGODB_URI")
	if mongoURI == "" {
		log.Fatal("❌ MONGODB_URI is not set in .env")
	}

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(mongoURI))
	if err != nil {
		log.Fatal(err)
	}

	dbName := os.Getenv("DB_NAME")
	if dbName == "" {
		log.Fatal("❌ DATABASE_NAME is not set in .env")
	}

	DB = client.Database(dbName)
	fmt.Println("✅ Connected to MongoDB")

	// Init Firebase (Function defined in firebase.go)
	InitFirebase()

	r := gin.Default()

	// 🔥 APPLY CORS MIDDLEWARE HERE (Must be before routes)
	r.Use(CORSMiddleware())

	TopicRoutes(r, DB)
	JournalRoutes(r, DB)
	UserRoutes(r, DB)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🚀 Server running on http://localhost:" + port)
	r.Run(":" + port)
}