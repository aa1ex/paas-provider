package util

import (
	"math/rand"
	"strconv"
	"time"
)

// GenerateID generates a unique ID
func GenerateID() string {
	rand.Seed(time.Now().UnixNano())
	return strconv.FormatInt(time.Now().UnixNano(), 10) + strconv.Itoa(rand.Intn(1000))
}
