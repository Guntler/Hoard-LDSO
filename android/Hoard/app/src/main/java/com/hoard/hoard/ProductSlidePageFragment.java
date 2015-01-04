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

public class ProductSlidePageFragment extends Fragment {

    /**
     * Image View
     */
    private ImageView productImageView;

    /**
     * Text View
     */
    private TextView productNameTextView;

    /**
     * Products
     */
    private Products products;

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

        productImageView = (ImageView)rootView.findViewById(R.id.product_image_view);

        hoardAPI = new HoardAPI(this.getActivity());

        new ProductAsyncTask(this.getActivity()).execute();

        return rootView;
    }

    class ProductAsyncTask extends AsyncTask<String, String, String> {

        private Context context;

        public ProductAsyncTask(Context context) {
            this.context = context;
        }

        @Override
        protected String doInBackground(String... strings) {
            try {
                products = hoardAPI.getProducts();

                if(products != null)
                    for(Product prod : products.getResult()) {
                        Log.d("Product: ", prod.getName() + " link - " + prod.getImageName());
                    }

            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("FavoriteActivity>FavoritesAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        @Override
        protected void onPostExecute(String notUsed) {
            if(products != null) {
                productNameTextView.setText(products.getResult().get(0).getName());
                new DownloadImageTask(productImageView).execute(context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.product_images_url)+products.getResult().get(0).getImageName());
            }
        }

        private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
            ImageView imageView;
            //ProgressBar progressBar;

            public DownloadImageTask(ImageView imageView/*, ProgressBar progressBar*/) {
                this.imageView = imageView;
                //this.progressBar = progressBar;
            }

            protected Bitmap doInBackground(String... urls) {
                Log.i("ProductSlidePageFragment>DownloadImageTask>doInBackground Url: ", urls[0]);
                String urlDisplay = urls[0];
                Bitmap imageBitmap = null;
                try {
                    InputStream in = new java.net.URL(urlDisplay).openStream();
                    imageBitmap = BitmapFactory.decodeStream(in);
                    in.close();
                } catch (Exception e) {
                    String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                    Log.e("ProductSlidePageFragment>DownloadImageTask>doInBackground: ", errorMessage);
                    e.printStackTrace();
                }
                return imageBitmap;
            }

            protected void onPostExecute(Bitmap imageBitmap) {
                imageView.setImageBitmap(imageBitmap);
                //progressBar.setVisibility(View.GONE);
            }
        }
    }
}
