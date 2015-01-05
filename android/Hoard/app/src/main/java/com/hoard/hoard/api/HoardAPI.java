package com.hoard.hoard.api;

import android.content.Context;
import android.util.Log;
import android.util.Pair;

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

    public Pair<Boolean, String> signInUser(String email, String password) {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.sigin_url);
        String body = "email=" + email + "&password=" + password;
        try {
            HttpRequest request = httpRequestFactory.buildPostRequest(new GenericUrl(url), ByteArrayContent.fromString("application/x-www-form-urlencoded", body));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            request.getHeaders().setContentType("application/x-www-form-urlencoded");

            HttpResponse response = request.execute();

            String cookie = getCookieConnectSID(response);

            ReturnParserWithUser parser = response.parseAs(ReturnParserWithUser.class);

            if(parser != null) {
                if(!parser.getMessage().isEmpty())
                    Log.d("Response: ", parser.getMessage());
                if (parser.getSuccess()) {
                    if (parser.getUser().getEmail() != null) {
                        if (cookie != null) {
                            session.logIn(email, cookie);
                            return new Pair<Boolean, String>(true, parser.getMessage());
                        }
                    }
                    return new Pair<Boolean, String>(false, parser.getMessage());
                }
            }
        } catch (Exception e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>signInUser>Exception:", errorMessage);
            return new Pair<Boolean, String>(false, "Something went wrong.");
        }
        return new Pair<Boolean, String>(false, "Something went wrong.");
    }

    public Pair<Boolean, String> changePassword(String oldPassword, String newPassword) {
        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.change_password_url);
        String body = "oldPassword=" + oldPassword + "&newPassword=" + newPassword;

        try {
            HttpRequest request = httpRequestFactory.buildPostRequest(new GenericUrl(url), ByteArrayContent.fromString("application/x-www-form-urlencoded", body));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            request.getHeaders().setContentType("application/x-www-form-urlencoded");

            if(session.checkSessionForCookie()) {
                request.getHeaders().setCookie(session.getCookie());
                Log.d("Cookie: ", session.getCookie());

                ChangePasswordReturnParser result = request.execute().parseAs(ChangePasswordReturnParser.class);

                if(result.getSuccess()){
                    if(result.getResult())
                        return new Pair<Boolean, String>(true, "Password changed successfully.");
                }
            }
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>changePassword>Exception:", errorMessage);
        }
        return new Pair<Boolean, String>(false, "Password wasn't changed successfully.");
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

    public Products getFavorites() {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.favorites_url);

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));

            if(session.checkSessionForCookie()) {
                request.getHeaders().setCookie(session.getCookie());
                Log.d("Cookie: ", session.getCookie());

                Products favs = request.execute().parseAs(Products.class);

                if(favs.getSuccess())
                    return favs;
            }
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>getFavorites>Exception:", errorMessage);
        }
        return null;
    }

    public Products getProducts() {

        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.products_url);

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));

            if(session.checkSessionForCookie()) {
                request.getHeaders().setCookie(session.getCookie());
                Log.d("Cookie: ", session.getCookie());

                Products products = request.execute().parseAs(Products.class);

                if(products.getSuccess())
                    return products;
            }
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>getProducts>Exception:", errorMessage);
        }
        return null;
    }

    public Pair<Boolean, String> removeProductFromFavorites(Product product) {
        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.remove_product_from_favorites_url)+product.getId();

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));

            if(session.checkSessionForCookie()) {
                request.getHeaders().setCookie(session.getCookie());
                Log.d("Cookie: ", session.getCookie());

                BasicReturnParser parser = request.execute().parseAs(BasicReturnParser.class);

                if(parser.getResult()){
                    if(parser.getSuccess()) {
                        return new Pair<Boolean, String>(true, "Product was removed from favorites.");
                    } else {
                        return new Pair<Boolean, String>(false, "Product wasn't removed from favorites.");
                    }
                }

            }
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>removeProductFromFavorites>Exception:", errorMessage);
        }

        return new Pair<Boolean, String>(false, "Something went wrong.");
    }

    public Pair<Boolean, String> recoverPassword(String email) {
        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.forgot_password_url)+email;

        try {
            HttpRequest request = httpRequestFactory.buildGetRequest(new GenericUrl(url));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));

            BasicReturnParser parser = request.execute().parseAs(BasicReturnParser.class);

            if(parser.getResult()){
                if(parser.getSuccess()) {
                    return new Pair<Boolean, String>(true, "An email has been sent.");
                } else {
                    return new Pair<Boolean, String>(false, "The provided email is invalid.");
                }
            }
        } catch (IOException e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>recoverPassword>Exception:", errorMessage);
        }

        return new Pair<Boolean, String>(false, "Something went wrong.");
    }

    public Pair<Boolean, String> registerEmailPassword(String email, String password) {
        HttpRequestFactory httpRequestFactory = createRequestFactory(HTTP_TRANSPORT);

        String url = context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.register_url);
        String body = "email=" + email + "&password=" + password;

        try {
            HttpRequest request = httpRequestFactory.buildPostRequest(new GenericUrl(url), ByteArrayContent.fromString("application/x-www-form-urlencoded", body));
            request.setConnectTimeout(Integer.parseInt(context.getResources().getString(R.string.timeout)));
            request.getHeaders().setContentType("application/x-www-form-urlencoded");

            HttpResponse response = request.execute();

            String cookie = getCookieConnectSID(response);

            BasicReturnParser parser = response.parseAs(BasicReturnParser.class);

            if(parser != null) {
                if(parser.getSuccess()) {
                    if (parser.getResult()) {
                        if (cookie != null) {
                            session.logIn(email, cookie);
                            return new Pair<Boolean, String>(true, parser.getMessage());
                        }
                    } else {
                        return new Pair<Boolean, String>(false, parser.getMessage());
                    }
                }
            }
        } catch (Exception e) {
            String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
            Log.e("HoardAPI>registerEmailPassword>Exception:", errorMessage);
        }

        return new Pair<Boolean, String>(false, "Something went wrong.");
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
