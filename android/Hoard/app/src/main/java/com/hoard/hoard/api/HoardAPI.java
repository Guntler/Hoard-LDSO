package com.hoard.hoard.api;

import android.content.Context;
import android.util.Log;

import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpHeaders;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;

import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.jackson2.JacksonFactory;

import com.hoard.hoard.R;

/**
 * Created by AndreSilva on 11/11/14
 */

public class HoardAPI {

    private Context context;

    // Global instance of the HTTP Transport
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();

    public HoardAPI(Context context) { this.context = context;}

    public Boolean signInUser(String email, String password) {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.sigin_url);
        String body = "email=" + email + "&password=" + password;
        try {
            HttpRequest request = httpRequestFactory.buildPostRequest(new GenericUrl(url), ByteArrayContent.fromString("application/x-www-form-urlencoded", body));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            request.getHeaders().setContentType("application/x-www-form-urlencoded");

            ReturnParser response = request.execute().parseAs(ReturnParser.class);

            return false;
        } catch (Exception e) {
            String errorMessage = (e.getMessage() == null) ? "Message is empty" : e.getMessage();
            Log.e("HoardAPI>signInUser>Exception:", errorMessage);
            return false;
        }
    }
/*
    public Boolean getFavorites() {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.favorites_url);

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            String baseUrl = request.getUrl().toString();

            Log.d("Request: ", baseUrl);

            ReturnParser response = request.execute().parseAs(ReturnParser.class);
            return response.getUser();
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>checkLoginForUsernamePassword>Exception:", errorMessage);
            return false;
        }
    }
*/
    public Boolean registerEmailPassword(String email, String password) {
/*        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.register_url)+email+"/"+password;

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            String baseUrl = request.getUrl().toString();

            Log.d("Request: ", baseUrl);

            User user = request.execute().parseAs(User.class);
            return true;
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>registerEmailPassword>Exception:", errorMessage);
            return false;
        }*/
        return false;
    }

    public static HttpRequestFactory createRequestFactory(final HttpTransport transport) {
        return transport.createRequestFactory(new HttpRequestInitializer() {
            public void initialize(HttpRequest request) {
                HttpHeaders headers = new HttpHeaders();
                headers.setCookie("hoard");
                request.setHeaders(headers);
                JsonObjectParser parser = new JsonObjectParser(new JacksonFactory());
                request.setParser(parser);
            }
        });
    }

}
