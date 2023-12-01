
1. Faites un copier coller du fichier .env_schema et appeler le .env.<br>
2. Ensuite vous allez sur votre intra 42 vous creer une app pour avoir un clientuid et un secret que vous allez mettre dans le .env.
(lorsque vous creer l'app sur l'intra il faudra mettre dans redirect uri: http://localhost:3000/auth/callback) <br>
3. Et c'est bon


```
npm install <br>
```
```
docker compose up -d <br>
```
```
npm run start:dev <br>
```


La doc est dispo a l'adresse http://localhost:3000/api