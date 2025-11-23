package main

import (
	"context"
	"fmt"
	"log"
	"os"
	"time"

	"github.com/gin-gonic/gin"
	"github.com/joho/godotenv"
	"go.mongodb.org/mongo-driver/mongo"
	"go.mongodb.org/mongo-driver/mongo/options"

	"linkjournal/routes"
)

var DB *mongo.Database

func main() {
	// Load environment
	if err := godotenv.Load(); err != nil {
		log.Println("⚠️ No .env file found, using system env vars")
	}

	// Connect MongoDB
	ctx, cancel := context.WithTimeout(context.Background(), 10*time.Second)
	defer cancel()

	client, err := mongo.Connect(ctx, options.Client().ApplyURI(os.Getenv("MONGODB_URI")))
	if err != nil {
		log.Fatal(err)
	}

	DB = client.Database(os.Getenv("DATABASE_NAME"))
	fmt.Println("✅ Connected to MongoDB Atlas")

	// Init Gin
	r := gin.Default()

	// Register routes
	routes.UserRoutes(r, DB)
	routes.TopicRoutes(r, DB)
	routes.JournalRoutes(r, DB)

	// Start server
	port := os.Getenv("PORT")
	if port == "" {
		port = "8080"
	}
	fmt.Println("🚀 Server running on http://localhost:" + port)
	r.Run(":" + port)
}
