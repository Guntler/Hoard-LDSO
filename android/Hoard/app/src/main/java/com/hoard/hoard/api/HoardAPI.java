package com.hoard.hoard.api;

import android.content.Context;
import android.util.Log;

import com.google.api.client.http.ByteArrayContent;
import com.google.api.client.http.GenericUrl;
import com.google.api.client.http.HttpHeaders;
import com.google.api.client.http.HttpRequest;
import com.google.api.client.http.HttpRequestFactory;
import com.google.api.client.http.HttpRequestInitializer;
import com.google.api.client.http.HttpResponse;
import com.google.api.client.http.HttpTransport;
import com.google.api.client.http.javanet.NetHttpTransport;

import com.google.api.client.json.JsonObjectParser;
import com.google.api.client.json.jackson2.JacksonFactory;

import com.hoard.hoard.R;
import com.hoard.hoard.Session;

import java.io.IOException;
import java.util.ArrayList;

/**
 * Created by AndreSilva on 11/11/14
 */

public class HoardAPI {

    private Context context;

    // Global instance of the HTTP Transport
    private static final HttpTransport HTTP_TRANSPORT = new NetHttpTransport();

    /*
     * Session
     */
    private Session session;

    public HoardAPI(Context context) {
        this.context = context;
        session = new Session(context);
    }

    public Boolean signInUser(String email, String password) {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.sigin_url);
        String body = "email=" + email + "&password=" + password;
        try {
            HttpRequest request = httpRequestFactory.buildPostRequest(new GenericUrl(url), ByteArrayContent.fromString("application/x-www-form-urlencoded", body));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            request.getHeaders().setContentType("application/x-www-form-urlencoded");

            HttpResponse response = request.execute();

            String cookie = getCookieConnectSID(response);

            ReturnParser parser = response.parseAs(ReturnParser.class);

            Log.d("Response: ", parser.getMessage());
            if(parser.getMessage() != null) {
                if(cookie != null) {
                    session.logIn(email, cookie);
                    return true;
                }
            }
        } catch (IOException e) {
            String errorMessage = (e.getMessage() == null) ? "Message is empty" : e.getMessage();
            Log.e("HoardAPI>signInUser>Exception:", errorMessage);
            return false;
        }
        return false;
    }

    private String getCookieConnectSID(HttpResponse response) {
        ArrayList<String> headerField = (ArrayList<String>) response.getHeaders().get("Set-Cookie");

        String[] cookies = headerField.get(0).split("; ");
        for(String singleCookie : cookies) {
            if(singleCookie.startsWith("connect.sid="))
                return singleCookie;
        }
        return null;
    }

    public Favorites getFavorites() {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.favorites_url);

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));

            if(session.checkSessionForCookie()) {
                request.getHeaders().setCookie(session.getCookie());
                Log.d("Cookie: ", session.getCookie());

                return request.execute().parseAs(Favorites.class);
            }
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>checkLoginForUsernamePassword>Exception:", errorMessage);
        }
        return null;
    }

    public Boolean registerEmailPassword(String email, String password) {
        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.register_url)+email+"/"+password;

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            String baseUrl = request.getUrl().toString();

            Log.d("Request: ", baseUrl);

            HttpResponse response = request.execute();

            ArrayList<String> headerField = (ArrayList<String>) response.getHeaders().get("Set-Cookie");

            String cookie = headerField.get(0).split("; ")[0];
            Log.d("Cookie: ", cookie);

            session.logIn(email, cookie);

            return true;
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
                request.setHeaders(headers);
                JsonObjectParser parser = new JsonObjectParser(new JacksonFactory());
                request.setParser(parser);
            }
        });
    }

}
