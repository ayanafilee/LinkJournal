package routes

import (
	"linkjournal/controllers"

	"github.com/gin-gonic/gin"
	"go.mongodb.org/mongo-driver/mongo"
)

func UserRoutes(r *gin.Engine, db *mongo.Database) {
	userCol := db.Collection("users")
	r.POST("/api/register", func(c *gin.Context) { controllers.RegisterUser(c, userCol) })
	r.POST("/api/login", func(c *gin.Context) { controllers.LoginUser(c, userCol) })
	r.GET("/api/users/:id", func(c *gin.Context) { controllers.GetUserProfile(c, userCol) })
	r.PUT("/api/users/:id", func(c *gin.Context) { controllers.UpdateUserProfile(c, userCol) })
}
