package com.hoard.hoard;

/**
 * Created by AndreSilva on 21/10/14
 */

import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.TextView;

public class ProductSlidePageFragment extends Fragment {

    /**
     * Image View
     */
    ImageView productImageView;

    /**
     * Text View
     */
    TextView productNameTextView;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        ViewGroup rootView = (ViewGroup) inflater.inflate(
                R.layout.single_product_pageviewer_item_layout, container, false);

        productNameTextView = (TextView)rootView.findViewById(R.id.product_id);

        productNameTextView.setText("Product");

        productImageView = (ImageView)rootView.findViewById(R.id.product_image_view);

        return rootView;
    }
}
