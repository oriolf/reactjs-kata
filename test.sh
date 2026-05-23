#!/usr/bin/env bash

backendFolder="../simple-app/example/"

cd $backendFolder
go build -o backend
cd -
mv "$backendFolder/backend" .
./backend seed-e2e
./backend http &
backendPID=$!

npm run build
cd dist
python -m http.server 5173 &
frontendPID=$!
cd ..

echo "Nom,DNI,Soci/a des de
Laura,11111111H,2021-01-01
Pepe,22222222J,2022-01-01
Laia,33333333P,2023-01-01
Ramón,44444444A,2024-01-01
Incorrecte,,3000-01-01" > e2e/test-members.csv

trap cleanup EXIT

function cleanup {
    kill $backendPID
    kill $frontendPID
    rm db.db
    rm backend
    rm e2e/test-members.csv
}

npm run test
