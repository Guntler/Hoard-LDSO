package com.hoard.hoard.api;

import android.content.Context;
import android.util.Log;

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

import java.io.IOException;

/**
 * Created by AndreSilva on 11/11/14
 */
public class HoardAPI {

    Context context;

    // Global instance of the HTTP Transport
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();

    public HoardAPI(Context context) { this.context = context;}

    public Boolean checkLoginForEmailPassword(String email, String password) {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.login_url)+email+"/"+password;

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            String baseUrl = request.getUrl().toString();

            Log.d("Request: ", baseUrl);

            User user = request.execute().parseAs(User.class);
            return user.getResult();
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>checkLoginForUsernamePassword>Exception:", errorMessage);
            return false;
        }
    }

    public Boolean registerEmailPassword(String email, String password) {
        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.register_url)+email+"/"+password;

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            String baseUrl = request.getUrl().toString();

            Log.d("Request: ", baseUrl);

            User user = request.execute().parseAs(User.class);
            return user.getResult();
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>registerEmailPassword>Exception:", errorMessage);
            return false;
        }
    }

    public static HttpRequestFactory createRequestFactory(final HttpTransport transport) {
        return transport.createRequestFactory(new HttpRequestInitializer() {
            public void initialize(HttpRequest request) {
                HttpHeaders headers = new HttpHeaders();
                headers.setUserAgent("Diagnostico");
                request.setHeaders(headers);
                JsonObjectParser parser = new JsonObjectParser(new JacksonFactory());
                request.setParser(parser);
            }
        });
    }

}
