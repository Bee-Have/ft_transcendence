Faites un copier coller du fichier .env_schema et appeler le .env.
Ensuite vous allez sur votre intra 42 vous creer une app pour avoir un clientuid et un secret que vous allez mettre dans le .env.
(lorsque vous creer l'app sur l'intra il faudra mettre dans redirect uri: http://localhost:3000/auth/callback)
Et c'est bon

1 - npm install
2 - docker compose up -d
3 - npm run start:dev


La doc est dispo a l'adresse http://localhost:3000/api