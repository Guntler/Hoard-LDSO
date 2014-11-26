package com.hoard.hoard.api;

import com.google.api.client.util.Key;

import java.util.ArrayList;

/**
 * Created by AndreSilva on 26/11/14
 */
public class Favorites {

    @Key
    ArrayList<Product> result;

    public ArrayList<Product> getResult() {
        return result;
    }
}
