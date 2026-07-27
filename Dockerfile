# Use a lightweight official Java runtime as a parent image
FROM eclipse-temurin:17-jdk-alpine

# Set the working directory inside the container
WORKDIR /app

# Copy the Maven wrapper files and pom.xml first to cache dependencies
COPY mvnw .
COPY .mvn .mvn
COPY pom.xml .

# Download dependencies (this layer will be cached if pom.xml doesn't change)
RUN ./mvnw dependency:go-offline -B

# Copy the rest of your source code
COPY src src

# Build the application jar file
RUN ./mvnw package -DskipTests

# Run the jar file (finds the built jar dynamically)
ENTRYPOINT ["sh", "-c", "java -jar target/*.jar"]