package common

import (
	"archive/zip"
	"gopkg.in/yaml.v3"
	"io"
	"io/fs"
	"os"
	"path/filepath"
	"strings"
	"text/template"
)

// VerifyDomain Verify that the domain format is correct. eg:domain http://<host>:<port>/
func VerifyDomain(domain string) bool {
	domainSlice := strings.Split(domain, ":")
	// Judge its length
	if len(domainSlice) != 3 {
		return false
	}
	// Take its host and verify it
	host := domainSlice[1]
	if hostHasPrefix := strings.HasPrefix(host, "//"); hostHasPrefix == false {
		return false
	}
	// View its protocol type
	if protocol := domainSlice[0]; protocol != "https" && protocol != "http" {
		return false
	}
	return true
}

// SplitDomain Cut the link
// http://<host>:<port>/ --> useHttps:false|host:<host>|port:<port>
func SplitDomain(domain string) (useHttps bool, host string, port string) {
	domainSlice := strings.Split(domain, ":")
	// Gets whether it is http or https
	protocol := domainSlice[0]
	if flag := strings.HasSuffix(protocol, "s"); flag {
		useHttps = true
	} else {
		useHttps = false
	}
	// desc: Change host from `//127.0.0.1` to `127.0.0.1`
	hostString := domainSlice[1]
	host = strings.ReplaceAll(hostString, "//", "")
	// desc: Change the port from `8088/` to `8088`
	portString := domainSlice[2]
	if portHasSuffix := strings.HasSuffix(portString, "/"); portHasSuffix {
		port = strings.ReplaceAll(portString, "/", "")
	} else {
		port = portString
	}

	return useHttps, host, port
}

// WriteDocument Write to the interface documentation
func WriteDocument(exPath, host string) (bool, error) {
	ymlPath := filepath.Join(exPath, "static", "resulttransformer", "config.yml")
	docTemPath := filepath.Join(exPath, "static", "resulttransformer", "doc_template.html")
	docPath := filepath.Join(exPath, "static", "resulttransformer", "doc.html")

	// Read yaml file
	yamlFile, err := os.ReadFile(ymlPath)
	if err != nil {
		return false, err
	}

	// MDConfig Stores the parameters in the YAML file
	type Config struct {
		Domain string `yaml:"domain"`
	}
	// Parse the contents of the YAML file into the Config struct
	var config Config
	if err := yaml.Unmarshal(yamlFile, &config); err != nil {
		return false, err
	}
	// Update yaml file
	config.Domain = host
	output, err := yaml.Marshal(config)
	if err != nil {
		return false, err
	}
	if err := os.WriteFile(ymlPath, output, 0644); err != nil {
		return false, err
	}

	// Create a template object and parse the Markdown template
	tpl, err := template.ParseFiles(docTemPath)
	if err != nil {
		return false, err
	}

	outputFile, err := os.Create(docPath)
	if err != nil {
		return false, err
	}
	defer outputFile.Close()
	if err = tpl.Execute(outputFile, config); err != nil {
		return false, err
	}
	return true, nil
}

// Gzip compressed files
func Gzip(exPath string) (bool, string, error) {
	dirToZip := filepath.Join(exPath, "static", "resulttransformer")
	zipFileName := filepath.Join(exPath, "static", "replace.zip")

	// delete old zip
	os.RemoveAll(zipFileName)

	zipFile, err := os.Create(zipFileName)
	if err != nil {
		return false, "", err
	}
	defer zipFile.Close()

	// Create zip.Writer
	zipWriter := zip.NewWriter(zipFile)
	defer zipWriter.Close()

	// Recursively compresses the specified directory
	err = filepath.Walk(dirToZip, func(path string, info fs.FileInfo, err error) error {
		if err != nil {
			return err
		}

		// Skip top-level directories and other subdirectories
		if path == dirToZip || !strings.HasPrefix(path, dirToZip+"/") {
			return nil
		}
		header, err := zip.FileInfoHeader(info)
		if err != nil {
			return err
		}
		header.Name = strings.TrimPrefix(path, dirToZip+"/")
		if info.IsDir() {
			header.Name += "/"
			_, err = zipWriter.CreateHeader(header)
			if err != nil {
				return err
			}
		} else {
			writer, err := zipWriter.CreateHeader(header)
			if err != nil {
				return err
			}
			file, err := os.Open(path)
			if err != nil {
				return err
			}
			defer file.Close()
			_, err = io.Copy(writer, file)
			if err != nil {
				return err
			}
		}
		return nil
	})
	if err != nil {
		return false, "", err
	}
	return true, zipFileName, nil
}
