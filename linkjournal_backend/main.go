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
		// 🔥 DEBUGGING: Print the specific MongoDB error to the console
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
		// 🔥 DEBUGGING: Print the specific MongoDB error
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

// ======================= ROUTES =========================

func TopicRoutes(r *gin.Engine, db *mongo.Database) {
	col := db.Collection("topics")
	r.POST("/api/topics", AuthMiddleware(), func(c *gin.Context) { CreateTopic(c, col) })
	r.GET("/api/topics", AuthMiddleware(), func(c *gin.Context) { GetUserTopics(c, col) })
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

	TopicRoutes(r, DB)
	JournalRoutes(r, DB)

	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}

	fmt.Println("🚀 Server running on http://localhost:" + port)
	r.Run(":" + port)
}