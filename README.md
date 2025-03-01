# Конфигурации линтеров и typescript

## Список конфигураций

- eslint-backend - настройки eslint для фронтенд проектов
- eslint-frontend - настройки eslint для бекенд проектов
- prettier - общие настройки форматера кода
- stylelint - настройки stylelint для фронтенд проектов
- tsconfig-backend - настройки typescript для фронтенд проектов
- tsconfig-frontend - настройки typescript для бекенд проектов

## Список библиотек

- tscpaths - форк <https://github.com/joonhocho/tscpaths>, с фиксами
- pinia-fetch-store - форк <https://github.com/AgajLumbardh/pinia-fetch-store>, с доработками
- sonarqube-scanner - обертка над библиотекой <https://github.com/SonarSource/sonar-scanner-npm>, упрощающая взаимодействие
- build-nestjs-app-in-one-file - собирает бекенд в один файл (бинарники тоже вытаскивает в общую папку), после этого при развертывании нужна только установленная nodejs. Для сборки используется `@vercel/ncc`
- helpers - библиотека вспомогательных функции, является внутренней и используется в работе других приложений этого репозитория, не предназначена для установки в проекты

## Список конфигов для сборщиков

- vite-config - конфиг для vite, для сборки spa приложений

## Публикация новый версий

Публикация новых версий происходит с помощью github actions при мерже ветки задачи в master.
В package.json файле предварительно нужно повысить версию пакета самостоятельно до мержа.
