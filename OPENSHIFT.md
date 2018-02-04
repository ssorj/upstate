# Deployment on OpenShift

## Create a project

1. In the OpenShift console, click **Create Project**.
2. Set **Name** to `upstate`.
3. Set **Display Name** to `Upstate`.
4. Click **Create**.

## Deploy the test broker

1. Click **Add to Project** and then **Browse Catalog**.
2. Select the **Python** builder from the catalog.
3. Set **Version** to 3.5.
4. Click **advanced options**.
5. Set **Name** to `broker-python`.
6. Set **Git Repository URL** to `https://github.com/ssorj/upstate.git`.
7. Set **Context Dir** to `broker-python`.
8. Disable the **Create a route to the application** option.

## Create a shared config map

1. Hover over **Resources** and click **Config Maps**.
2. Click **Create Config Map**.
3. Set **Name** to `upstate-config`.
4. Set **Key** to `MESSAGING_SERVICE_HOST`.
5. Set **Value** to `broker-python.upstate.svc`.
6. Click **Add Item**.
7. Set **Key** to `MESSAGING_SERVICE_PORT`.
8. Set **Value** to `5672`.
9. Click **Create**.

## Deploy the web server

1. Click **Add to Project** and then **Browse Catalog**.
2. Select the **Node.js** builder from the catalog.
3. Click **Next** to go to the configuration step.
4. Set **Version** to 6.
5. Navigate to **advanced options**.
6. Set **Name** to `web-nodejs`.
7. Set **Git Repository URL** to `https://github.com/ssorj/upstate.git`.
8. Set **Context Dir** to `web-nodejs`.
9. Click **Create**.
10. [Use the shared config map.](#use-the-shared-config-map)

## Deploy the Node.js worker

1. Click **Add to Project** and then **Browse Catalog**.
2. Select the **Node.js** builder from the catalog.
3. Click **Next** to go to the configuration step.
4. Click **advanced options**.
5. Set **Name** to `worker-nodejs`.
6. Set **Git Repository URL** to `https://github.com/ssorj/upstate.git`.
7. Set **Context Dir** to `worker-nodejs`.
8. Disable the **Create a route to the application** option.
9. Click **Create**.
10. [Use the shared config map.](#use-the-shared-config-map)

## Deploy the Spring worker

1. Click **Add to Project** and then **Browse Catalog**.
2. Select the **Red Hat OpenJDK 8** builder from the catalog.
3. Click **Next** to go to the configuration step.
4. Click **advanced options**.
5. Set **Name** to `worker-spring`.
6. Set **Git Repository URL** to `https://github.com/ssorj/upstate.git`.
7. Set **Context Dir** to `worker-spring`.
8. Disable the **Create a route to the application** option.
9. Click **Create**.
10. [Use the shared config map.](#use-the-shared-config-map)

## Deploy the Vert.x worker

1. Click **Add to Project** and then **Browse Catalog**.
2. Select the **Red Hat OpenJDK 8** builder from the catalog.
3. Click **Next** to go to the configuration step.
4. Click **advanced options**.
5. Set **Name** to `worker-vertx`.
6. Set **Git Repository URL** to `https://github.com/ssorj/upstate.git`.
7. Set **Context Dir** to `worker-vertx`.
8. Disable the **Create a route to the application** option.
9. Click **Create**.
10. [Use the shared config map.](#use-the-shared-config-map)

## Use the shared config map

1. Go to the project overview and find the deployment you want to
   modify.
2. Go to the **Environment** tab.
3. In the **Environment From** section, select the `upstate-config`
   config map.
4. Click **Save**.
