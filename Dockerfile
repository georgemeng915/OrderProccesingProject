# Stage 1: Build the application using Gradle
FROM gradle:8.5-jdk17 AS builder
WORKDIR /app
COPY . .
# Build the jar file, skipping tests to speed up container building
RUN ./gradlew bootJar --no-daemon

# Stage 2: Run the application in a lightweight JRE image
FROM eclipse-temurin:17-jre-jammy
WORKDIR /app
# Copy the built jar from the builder stage
COPY --from=builder /app/build/libs/*.jar app.jar

EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]