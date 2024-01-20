package helloworld;

import com.amazonaws.services.dynamodbv2.datamodeling.*;
import java.util.*;

@DynamoDBTable(tableName = "students-shyftlabs")
public class Student {
    private String itemType;
    private String uniqueId;
    private String firstName;
    private String familyName;
    private String dateOfBirth;
    private Map<String, String> results;

    @DynamoDBHashKey(attributeName = "itemType")
    public String getItemType() {
        return itemType;
    }
    public void setItemType(String itemType) {
        this.itemType = itemType;
    }

    @DynamoDBRangeKey(attributeName = "uniqueId")
    public String getUniqueId() {
        return uniqueId;
    }
    public void setUniqueId(String uniqueId) {
        this.uniqueId = uniqueId;
    }

    @DynamoDBAttribute(attributeName = "firstName")
    public String getFirstName() {
        return firstName;
    }
    public void setFirstName(String firstName) {
        this.firstName = firstName;
    }

    @DynamoDBAttribute(attributeName = "familyName")
    public String getFamilyName() {
        return familyName;
    }
    public void setFamilyName(String familyName) {
        this.familyName = familyName;
    }

    @DynamoDBAttribute(attributeName = "dateOfBirth")
    public String getDateOfBirth() {
        return dateOfBirth;
    }
    public void setDateOfBirth(String dateOfBirth) {
        this.dateOfBirth = dateOfBirth;
    }

    @DynamoDBAttribute(attributeName = "results")
    public Map<String, String> getResults() {
        return results;
    }
    public void setResults(Map<String, String> results) {
        this.results = results;
    }
}