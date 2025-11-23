package routes

import (
	"linkjournal/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func TopicRoutes(r *gin.Engine, db *mongo.Database) {
	col := db.Collection("topics")
	r.POST("/api/topics", func(c *gin.Context) { controllers.CreateTopic(c, col) })
	r.GET("/api/topics/:userId", func(c *gin.Context) { controllers.GetUserTopics(c, col) })
}
