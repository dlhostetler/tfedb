package main

import (
	"encoding/json"
	"fmt"
	"net/http"
	"strconv"
)

func RequiredParamString(request *http.Request, param string) (string, bool) {
	queries, ok := request.URL.Query()[param]
	if !ok || len(queries[0]) < 1 {
		return "", false
	}
	return queries[0], true
}

func RequiredParamInt(request *http.Request, param string) (int, bool) {
	s, ok := RequiredParamString(request, param)
	if !ok {
		return 0, false
	}
	i, err := strconv.Atoi(s)
	if err != nil {
		return 0, false
	}
	return i, true
}

func ParamPassed(request *http.Request, param string) bool {
	_, ok := request.URL.Query()[param]
	return ok
}

func JsonResponse(response http.ResponseWriter, body interface{}, pretty bool) {
	var js []byte
	var err error
	if pretty {
		js, err = json.MarshalIndent(body, "", "  ")
	} else {
		js, err = json.Marshal(body)
	}
	if err != nil {
		http.Error(response, err.Error(), http.StatusInternalServerError)
		return
	}
	response.WriteHeader(200)
	response.Header().Set("Content-Type", "application/json")
	if _, err := response.Write(js); err != nil {
		fmt.Println(err)
	}
}
