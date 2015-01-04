package com.hoard.hoard;

import android.content.Context;
import android.graphics.Bitmap;
import android.graphics.BitmapFactory;
import android.media.Image;
import android.os.AsyncTask;
import android.util.Log;
import android.util.Pair;
import android.view.LayoutInflater;
import android.view.MotionEvent;
import android.view.View;
import android.view.ViewGroup;
import android.widget.BaseAdapter;
import android.widget.ImageButton;
import android.widget.ImageView;
import android.widget.ProgressBar;
import android.widget.TextView;

import com.hoard.hoard.api.HoardAPI;
import com.hoard.hoard.api.Product;

import java.io.InputStream;
import java.util.ArrayList;

/**
 * Created by AndreSilva on 19/11/14
 */

public class ProductAdapter extends BaseAdapter {

    /*
     * Context
     */
    private Context context;

    /*
     * Layout Inflater
     */
    private LayoutInflater inflater;

    /*
     * Products List
     */
    private ArrayList<Product> items = new ArrayList<Product>();

    public ProductAdapter(Context context, ArrayList<Product> favorites) {
        this.context = context;
        inflater = LayoutInflater.from(context);
        items = favorites;
    }

    @Override
    public int getCount() {
        return items.size();
    }

    @Override
    public Product getItem(int i) {
        return items.get(i);
    }

    @Override
    public long getItemId(int i) {
        return 0;
    }

    @Override
    public View getView(int i, View view, ViewGroup viewGroup) {

        if(view == null) {
            view = inflater.inflate(R.layout.favorite_item_layout, viewGroup, false);
            view.setTag(R.id.grid_item_image, view.findViewById(R.id.grid_item_image));
            view.setTag(R.id.grid_item_text, view.findViewById(R.id.grid_item_text));
            view.setTag(R.id.grid_item_progressbar, view.findViewById(R.id.grid_item_progressbar));
            view.setTag(R.id.grid_item_close_button, view.findViewById(R.id.grid_item_close_button));
        }

        ImageView picture = (ImageView)view.getTag(R.id.grid_item_image);
        TextView name = (TextView)view.getTag(R.id.grid_item_text);
        ProgressBar progressBar = (ProgressBar)view.getTag(R.id.grid_item_progressbar);
        ImageButton closeImageButton = (ImageButton)view.getTag(R.id.grid_item_close_button);

        final int productPosition = i;
        final Product product = getItem(i);
        closeImageButton.setOnClickListener(new View.OnClickListener() {
            @Override
            public void onClick(View view) {
                new RemoveFavoriteTask(context, product, productPosition).execute();
            }
        });

        DownloadImageTask task = new DownloadImageTask(picture, progressBar, closeImageButton);
        task.execute(context.getResources().getString(R.string.server_url)+context.getResources().getString(R.string.product_images_url)+product.getImageName());
        name.setText(product.getName());

        return view;
    }

    private class RemoveFavoriteTask extends AsyncTask<String, String, String> {

        /*
         * Product
         */
        private Product product;
        private int productPosition;

        /*
         * Hoard API
         */
        private HoardAPI hoardAPI;
        private Pair<Boolean, String> valid;


        public RemoveFavoriteTask(Context context, Product product, int productPosition) {
            this.product = product;
            this.productPosition = productPosition;
            hoardAPI = new HoardAPI(context);
        }

        @Override
        protected String doInBackground(String... args) {
            try {
                valid = hoardAPI.removeProductFromFavorites(product);
            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("FavoriteActivity>FavoritesAsyncTask>doInBackground>Exception:", errorMessage);
            }

            return null;
        }

        @Override
        protected void onPostExecute(String notUsed) {
            if(valid.first) {
                items.remove(productPosition);
            } else {

            }
        }
    }

    private class DownloadImageTask extends AsyncTask<String, Void, Bitmap> {
        ImageView imageView;
        ProgressBar progressBar;
        ImageButton closeImageButton;

        public DownloadImageTask(ImageView bmImage, ProgressBar progressBar, ImageButton closeImageButton) {
            this.imageView = bmImage;
            this.progressBar = progressBar;
            this.closeImageButton = closeImageButton;
        }

        protected Bitmap doInBackground(String... urls) {
            String urlDisplay = urls[0];
            Bitmap mIcon11 = null;
            try {
                InputStream in = new java.net.URL(urlDisplay).openStream();
                mIcon11 = BitmapFactory.decodeStream(in);
                in.close();
            } catch (Exception e) {
                String errorMessage = (e.getMessage()==null)?"Message is empty":e.getMessage();
                Log.e("ProductAdapter>DownloadImageTask>doInBackground: ", errorMessage);
            }
            return mIcon11;
        }

        protected void onPostExecute(Bitmap result) {
            imageView.setScaleType(ImageView.ScaleType.FIT_CENTER);
            imageView.setAdjustViewBounds(true);
            imageView.setImageBitmap(result);
            progressBar.setVisibility(View.GONE);
            closeImageButton.setVisibility(View.VISIBLE);
        }
    }
}