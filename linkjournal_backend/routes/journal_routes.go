package routes

import (
	"linkjournal/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func JournalRoutes(r *gin.Engine, db *mongo.Database) {
	col := db.Collection("journals")

	r.POST("/api/journals", func(c *gin.Context) { controllers.CreateJournal(c, col) })
	r.GET("/api/journals/:userId", func(c *gin.Context) { controllers.GetUserJournals(c, col) })
	r.GET("/api/journal/:id", func(c *gin.Context) { controllers.GetJournalByID(c, col) })
	r.PUT("/api/journal/:id", func(c *gin.Context) { controllers.UpdateJournal(c, col) })
	r.DELETE("/api/journal/:id", func(c *gin.Context) { controllers.DeleteJournal(c, col) })
	r.PUT("/api/journal/:id/important", func(c *gin.Context) { controllers.ToggleImportant(c, col) })
}
