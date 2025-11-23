package controllers

import (
	"context"
	"net/http"
	"time"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/bson"
	"go.mongodb.org/mongo-driver/bson/primitive"
	"go.mongodb.org/mongo-driver/mongo"

	"linkjournal/models"
)

func CreateTopic(c *gin.Context, col *mongo.Collection) {
	var topic models.Topic
	if err := c.ShouldBindJSON(&topic); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	topic.ID = primitive.NewObjectID()
	topic.CreatedAt = time.Now()
	_, err := col.InsertOne(context.TODO(), topic)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create topic"})
		return
	}
	c.JSON(http.StatusCreated, topic)
}

func GetUserTopics(c *gin.Context, col *mongo.Collection) {
	userID, _ := primitive.ObjectIDFromHex(c.Param("userId"))
	cursor, err := col.Find(context.TODO(), bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching topics"})
		return
	}
	var topics []models.Topic
	cursor.All(context.TODO(), &topics)
	c.JSON(http.StatusOK, topics)
}
