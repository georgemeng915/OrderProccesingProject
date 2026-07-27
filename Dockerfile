# Stage 1: Build the application using Gradle
FROM eclipse-temurin:17-jdk AS build
WORKDIR /app

# Copy gradle wrapper and build files
COPY gradlew ./
COPY gradle gradle/
COPY build.gradle settings.gradle ./

# Download dependencies (cached if dependencies don't change)
RUN ./gradlew dependencies --no-daemon

# Copy source code and build the fat jar
COPY src src
RUN ./gradlew bootJar --no-daemon

# Stage 2: Run the application
FROM eclipse-temurin:17-jdk
WORKDIR /app

# Copy the built jar from the build stage
COPY --from=build /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]