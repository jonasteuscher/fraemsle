## NutriDish

### Running locally

1. Clone this project

```sh
git clone https://github.com/jonasteuscher/fraemsle.git
```

2. Change into the directory and install the dependencies

```sh
cd fraemsle

npm install
```

3. Run the server

```sh
npm run dev
```

4. Bei Fehlermeldung Error: error:0308010C:digital envelope routines::unsupported
```sh
export NODE_OPTIONS=--openssl-legacy-provider
```

->> Dann Schritt 3. erneut ausführen
