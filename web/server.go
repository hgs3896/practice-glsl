package main

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"net/http"
	"os"
	"path/filepath"
	"strconv"
	"strings"
)

func main() {
	var port int = 5000
	port_str, exist := os.LookupEnv("PORT")
	if exist {
		p, err := strconv.Atoi(port_str)
		if err != nil || (p < 0 || p > 2<<16-1) {
			fmt.Printf("Use a correct port number %v\n", p)
			return
		}
	}

	http.Handle("/", new(staticHandler))
	http.ListenAndServe(fmt.Sprintf(":%v", port), nil)
}

type staticHandler struct {
	http.Handler
}

func readFileLists(path string, file_type string) []string {
	entries, err := os.ReadDir(path)
	if err != nil {
		// error during reading src dir
		return nil
	}
	result := make([]string, 0, 30)
	suffix := "." + file_type
	for _, entry := range entries {
		filename := entry.Name()
		if !entry.IsDir() && strings.HasSuffix(filename, suffix) {
			result = append(result, entry.Name())
		}
	}
	return result
}

func (h *staticHandler) ServeHTTP(w http.ResponseWriter, req *http.Request) {
	var err error
	var path, contentType string
	var content []byte

	if req.URL.Path == "/list/fragment-shaders" {
		fragmentShaders := readFileLists("src", "frag")
		data := make(map[string]interface{})
		data["files"] = fragmentShaders

		jsonContents, err := json.Marshal(data)
		if err != nil {
			panic(err)
		}

		content = jsonContents
		contentType = getContentType(".json")
	} else {
		if req.URL.Path == "/" {
			path = "web/static/index.html" // default page
		} else {
			path = "web/static" + req.URL.Path // from static dir
		}
		content, err = ioutil.ReadFile(path)
		if err != nil {
			path = "src" + req.URL.Path // from src dir
			content, err = ioutil.ReadFile(path)
			if err != nil {
				w.WriteHeader(404)
				w.Write([]byte(http.StatusText(404)))
				return
			}
		}
		contentType = getContentType(path)
	}
	w.Header().Add("Content-Type", contentType)
	w.Write(content)
}

func getContentType(localPath string) string {
	var contentType string
	ext := filepath.Ext(localPath)

	switch ext {
	case ".html":
		contentType = "text/html"
	case ".css":
		contentType = "text/css"
	case ".js":
		contentType = "application/javascript"
	case ".json":
		contentType = "application/json"
	case ".png":
		contentType = "image/png"
	case ".jpg":
		contentType = "image/jpeg"
	default:
		contentType = "text/plain"
	}

	return contentType
}
