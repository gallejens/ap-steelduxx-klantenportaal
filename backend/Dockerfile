FROM maven:3.8.4-openjdk-17-slim as build

WORKDIR /app

COPY pom.xml .
COPY src ./src

RUN mvn clean package -DskipTests

FROM bellsoft/liberica-openjdk-alpine:17

WORKDIR /app

COPY --from=build /app/target/backend.jar .

CMD ["java", "-jar", "backend.jar"]
