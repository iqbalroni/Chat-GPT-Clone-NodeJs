@echo off
echo ====================
echo Halo,how are you bro?
echo ====================
set /p input="Apakah kamu ingin menghidupkan API Bot (y/t) :"
if /i "%input%"=="y" (
    cls
    echo Aplikasi sedang proses di jalankan
    cd "node_scraping_kbbi"
    npm start
) else if  /i "%input%"=="t" (
    echo Baik Terimakasih
) else (
    echo Jawaban Kamu Tidak Valid
)
