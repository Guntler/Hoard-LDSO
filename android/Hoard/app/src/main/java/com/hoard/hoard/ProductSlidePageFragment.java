package com.hoard.hoard;

/**
 * Created by AndreSilva on 21/10/14
 */

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.os.AsyncTask;
import android.os.Bundle;
import android.support.v4.app.Fragment;
import android.util.Log;
import android.util.Pair;
import android.view.LayoutInflater;
import android.view.View;
import android.view.ViewGroup;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.hoard.hoard.api.HoardAPI;
import com.hoard.hoard.api.Product;
import com.hoard.hoard.api.Products;

import java.io.InputStream;
import java.util.Random;

public class ProductSlidePageFragment extends Fragment {

    /**
     * Image View and Progress Bar
     */
    private ImageView productImageView;

    private ImageView productProgressImageView;
    private ProgressBar productProgressBar;

    /**
     * Text View
     */
    private TextView productNameTextView;

    /**
     * Products
     */
    private Products products;
    private int currentProduct = 0;
    /**
     * Hoard API
     */
    private HoardAPI hoardAPI;

    @Override
    public View onCreateView(LayoutInflater inflater, ViewGroup container,
                             Bundle savedInstanceState) {
        ViewGroup rootView = (ViewGroup) inflater.inflate(
                R.layout.single_product_pageviewer_item_layout, container, false);

        productNameTextView = (TextView)rootView.findViewById(R.id.product_id);
        productNameTextView.setVisibility(View.GONE);

        productImageView = (ImageView)rootView.findViewById(R.id.product_image_view);
        productProgressImageView = (ImageView)rootView.findViewById(R.id.product_progress_image);
        productImageView.setVisibility(View.GONE);

        productProgressBar = (ProgressBar)rootView.findViewById(R.id.product_progress_bar);
        productProgressBar.setVisibility(View.VISIBLE);

        hoardAPI = new HoardAPI(this.getActivity());

        new ProductAsyncTask(this.getActivity()).execute();

        return rootView;
    }

    public Products getProducts() {
        return products;
    }

    public int getCurrentProduct() { return currentProduct; }

    class ProductAsyncTask extends AsyncTask<String, String, String> {

        private Context context;

        public ProductAsyncTask(Context context) {
            this.context = context;
        }

        @Override
        protected String doInBackground(String... strings) {
            try {
                products = hoardAPI.getPreferencesProducts();

                if(products != null)
                    for(Product prod : products.getResult()) {
                        //Log.d("Product: ", prod.getName() + " link - " + prod.getImageName());
                    }

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("FavoriteActivity>FavoritesAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        @Override
        protected void onPostExecute(String notUsed) {
            if(products != null && products.getResult().size() > 0) {
                Random rnd = new Random();
                currentProduct = rnd.nextInt(products.getResult().size());
                Product product = products.getResult().get(currentProduct);
                productNameTextView.setText(product.getName());
                new DownloadImageTask(product, productImageView, productProgressImageView, productProgressBar).execute(context.getResources().getString(R.string.server_url) + context.getResources().getString(R.string.product_images_url) + products.getResult().get(currentProduct).getImageName());
            } else
                productProgressBar.setVisibility(View.GONE);
        }

        private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
            Product product;
            ImageView imageView;
            ImageView progressImageView;
            ProgressBar progressBar;

            public DownloadImageTask(Product product, ImageView imageView, ImageView progressImageView, ProgressBar progressBar) {
                this.product = product;
                this.imageView = imageView;
                this.progressImageView = progressImageView;
                this.progressBar = progressBar;
            }

            protected Bitmap doInBackground(String... urls) {
                String urlDisplay = urls[0];
                Bitmap imageBitmap = null;

                try {
                    InputStream in = new java.net.URL(urlDisplay).openStream();
                    imageBitmap = BitmapFactory.decodeStream(in);
                    in.close();
                } catch (Exception e) {
                    String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                    //Log.e("ProductSlidePageFragment>DownloadImageTask>doInBackground: ", errorMessage);
                }

                return imageBitmap;
            }

            protected void onPostExecute(Bitmap bitmap) {
                if(bitmap != null) {
                    progressImageView.setVisibility(View.GONE);
                    imageView.setImageBitmap(bitmap);
                    imageView.setVisibility(View.VISIBLE);
                }

                if(products != null) {
                    productNameTextView.setVisibility(View.VISIBLE);
                    ((MainActivity)getActivity()).setStillLoading(false);
                    new ViewedProductAsyncTask(product).execute();
                }

                progressBar.setVisibility(View.GONE);
            }
        }

        private class ViewedProductAsyncTask extends AsyncTask<String, String, String> {

            private Product product;

            private Pair<Boolean, String> valid;

            public ViewedProductAsyncTask(Product product) {
                this.product = product;
            }

            @Override
            protected String doInBackground(String... args) {
                try {
                    valid = hoardAPI.viewedProduct(product);
                } catch (Exception e) {
                    String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                    Log.e("ProductSlidePageFragment>ViewedProductAsyncTask>doInBackground: ", errorMessage);
                }

                return null;
            }

            protected void onPostExecute(String notUsed) {
                if(valid.first)
                    System.out.println(product.getName()+" was viewed " + valid.second);
            }
        }

    }
}
