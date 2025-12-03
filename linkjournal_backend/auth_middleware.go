package main

import (
	"net/http"
	"strings"

	"github.com/gin-gonic/gin"
)

func AuthMiddleware() gin.HandlerFunc {
	return func(c *gin.Context) {
		// Safety check: Ensure the global AuthClient is ready
		if AuthClient == nil {
			c.JSON(http.StatusInternalServerError, gin.H{"error": "Server Error: Firebase Auth not initialized"})
			c.Abort()
			return
		}

		header := c.GetHeader("Authorization")
		if header == "" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Missing Authorization header"})
			c.Abort()
			return
		}

		parts := strings.Split(header, " ")
		if len(parts) != 2 || parts[0] != "Bearer" {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid Authorization format"})
			c.Abort()
			return
		}

		idToken := parts[1]

		// Use the global AuthClient to verify the token
		token, err := AuthClient.VerifyIDToken(c, idToken)
		if err != nil {
			c.JSON(http.StatusUnauthorized, gin.H{"error": "Invalid or expired token"})
			c.Abort()
			return
		}

		// Store UID in context
		c.Set("uid", token.UID)
		c.Next()
	}
}