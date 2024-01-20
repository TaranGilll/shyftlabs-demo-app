package helloworld;

import com.amazonaws.services.lambda.runtime.Context;
import com.amazonaws.services.lambda.runtime.RequestHandler;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyRequestEvent;
import com.amazonaws.services.lambda.runtime.events.APIGatewayProxyResponseEvent;
import com.amazonaws.services.dynamodbv2.*;
import com.amazonaws.services.dynamodbv2.AmazonDynamoDB;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBMapper;
import com.amazonaws.services.dynamodbv2.datamodeling.DynamoDBQueryExpression;
import com.amazonaws.services.dynamodbv2.model.AttributeValue;
import com.amazonaws.HttpMethod;
import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.google.gson.Gson;
import com.google.gson.JsonElement;
import com.google.gson.JsonObject;
import com.google.gson.JsonParser;
import java.util.*;
import org.apache.http.HttpStatus;
import org.apache.http.entity.ContentType;


public class App implements RequestHandler<APIGatewayProxyRequestEvent, APIGatewayProxyResponseEvent> {
  private static final Gson GSON = new Gson();

  @Override
  public APIGatewayProxyResponseEvent handleRequest(final APIGatewayProxyRequestEvent input, final Context context) {
      final Map<String, String> headersMap = new HashMap<>();
      headersMap.put("Content-Type", ContentType.APPLICATION_JSON.toString());
      headersMap.put("X-Custom-Header", ContentType.APPLICATION_JSON.toString());
      headersMap.put("X-Requested-With", "*");
      headersMap.put("Access-Control-Allow-Origin", "*");
      headersMap.put("Access-Control-Allow-Credentials", "true");
      headersMap.put("Access-Control-Allow-Methods", "GET,PUT,POST,DELETE,OPTIONS");
      headersMap.put("Access-Control-Expose-Headers", "date");
      headersMap.put("Access-Control-Allow-Headers",
      "Access-Control-Allow-Headers, Origin,Accept, X-Requested-With, Content-Type, Access-Control-Request-Method, Access-Control-Request-Headers");

      APIGatewayProxyResponseEvent response = new APIGatewayProxyResponseEvent().withHeaders(headersMap);
      BasicAWSCredentials awsCreds= new BasicAWSCredentials("", "");
      AmazonDynamoDB client = AmazonDynamoDBClientBuilder.standard().withRegion("us-east-1").withCredentials(new AWSStaticCredentialsProvider(awsCreds)).build();
      DynamoDBMapper mapper = new DynamoDBMapper(client);

      JsonObject inputJson = Optional.ofNullable(input.getBody())
        .filter(s -> s.length() > 0)
        .map(JsonParser::parseString)
        .filter(JsonElement::isJsonObject)
        .map(JsonElement::getAsJsonObject)
        .orElse(null);

      // STUDENT API CALL
      if(input.getPath().equalsIgnoreCase("/students")) {
        // POST
        if(input.getHttpMethod().equalsIgnoreCase(HttpMethod.POST.name())) {
          Student newStud = new Gson().fromJson(inputJson, Student.class);
          
          String studentID = UUID.randomUUID().toString();
          newStud.setItemType("student");
          newStud.setUniqueId(studentID);
          mapper.save(newStud);

          JsonObject result = new JsonObject();
          result.add("student", JsonParser.parseString(GSON.toJson(newStud)));  
          response.withStatusCode(HttpStatus.SC_OK).withBody(GSON.toJson(result));
        }

        //UPDATE
        else if(input.getHttpMethod().equalsIgnoreCase(HttpMethod.PUT.name())) {
          Student newStud = new Gson().fromJson(inputJson, Student.class);
          newStud.setItemType("student");
          mapper.save(newStud);
          
          JsonObject result = new JsonObject();
          result.add("student", JsonParser.parseString(GSON.toJson(newStud)));  
          response.withStatusCode(HttpStatus.SC_OK).withBody(GSON.toJson(result));
        }

        // READ
        else if(input.getHttpMethod().equalsIgnoreCase(HttpMethod.GET.name())) {  
          HashMap<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
          eav.put(":itemType", new AttributeValue().withS("student"));
          
          DynamoDBQueryExpression<Student> expression = new DynamoDBQueryExpression<Student>()
          .withKeyConditionExpression("itemType = :itemType")
          .withExpressionAttributeValues(eav);

          List<Student> students = mapper.query(Student.class, expression);

          JsonObject result = new JsonObject();
          result.add("students", JsonParser.parseString(GSON.toJson(students)));  
          response.withStatusCode(HttpStatus.SC_OK).withBody(GSON.toJson(result));
        }


        // DELETE
        else if(input.getHttpMethod().equalsIgnoreCase(HttpMethod.DELETE.name())) {
          Student item = new Gson().fromJson(inputJson, Student.class);
          item.setItemType("student");
          
          mapper.delete(item);

          response.withStatusCode(HttpStatus.SC_OK).withBody("Delete student successful");
        }
      }
      else if(input.getPath().equalsIgnoreCase("/courses")) {
        // POST
        if(input.getHttpMethod().equalsIgnoreCase(HttpMethod.POST.name())) {
          Course newCourse = new Gson().fromJson(inputJson, Course.class);
          
          String courseId = UUID.randomUUID().toString();
          newCourse.setItemType("course");
          newCourse.setUniqueId(courseId);
          mapper.save(newCourse);

          JsonObject result = new JsonObject();
          result.add("course", JsonParser.parseString(GSON.toJson(newCourse)));  
          response.withStatusCode(HttpStatus.SC_OK).withBody(GSON.toJson(result));
        }

        // READ
        else if(input.getHttpMethod().equalsIgnoreCase(HttpMethod.GET.name())) {  
          HashMap<String, AttributeValue> eav = new HashMap<String, AttributeValue>();
          eav.put(":itemType", new AttributeValue().withS("course"));
          
          DynamoDBQueryExpression<Course> expression = new DynamoDBQueryExpression<Course>()
          .withKeyConditionExpression("itemType = :itemType")
          .withExpressionAttributeValues(eav);

          List<Course> courses = mapper.query(Course.class, expression);

          JsonObject result = new JsonObject();
          result.add("courses", JsonParser.parseString(GSON.toJson(courses)));  
          response.withStatusCode(HttpStatus.SC_OK).withBody(GSON.toJson(result));
        }
      }

      return response;
  }
}