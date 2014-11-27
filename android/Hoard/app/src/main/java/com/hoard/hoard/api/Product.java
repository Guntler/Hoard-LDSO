package com.hoard.hoard.api;

import com.google.api.client.util.Key;

/**
 * Created by AndreSilva on 26/11/14
 */
public class Product {

    @Key
    String name;

    @Key
    String link;

    @Key
    String imageName;

    public String getName() {
        return name;
    }

    public String getLink() {
        return link;
    }

    public String getImageName() { return imageName; }
}
