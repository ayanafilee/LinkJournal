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

func CreateJournal(c *gin.Context, col *mongo.Collection) {
	var j models.LinkJournal
	if err := c.ShouldBindJSON(&j); err != nil {
		c.JSON(http.StatusBadRequest, gin.H{"error": err.Error()})
		return
	}
	j.ID = primitive.NewObjectID()
	j.CreatedAt = time.Now()
	_, err := col.InsertOne(context.TODO(), j)
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to create journal"})
		return
	}
	c.JSON(http.StatusCreated, j)
}

func GetUserJournals(c *gin.Context, col *mongo.Collection) {
	userID, _ := primitive.ObjectIDFromHex(c.Param("userId"))
	cursor, err := col.Find(context.TODO(), bson.M{"user_id": userID})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Error fetching journals"})
		return
	}
	var journals []models.LinkJournal
	cursor.All(context.TODO(), &journals)
	c.JSON(http.StatusOK, journals)
}

func GetJournalByID(c *gin.Context, col *mongo.Collection) {
	id, _ := primitive.ObjectIDFromHex(c.Param("id"))
	var j models.LinkJournal
	err := col.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&j)
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
	var journal models.LinkJournal
	err := col.FindOne(context.TODO(), bson.M{"_id": id}).Decode(&journal)
	if err != nil {
		c.JSON(http.StatusNotFound, gin.H{"error": "Journal not found"})
		return
	}
	newVal := !journal.IsImportant
	_, err = col.UpdateByID(context.TODO(), id, bson.M{"$set": bson.M{"is_important": newVal}})
	if err != nil {
		c.JSON(http.StatusInternalServerError, gin.H{"error": "Failed to toggle important"})
		return
	}
	c.JSON(http.StatusOK, gin.H{"message": "Updated importance", "isImportant": newVal})
}
