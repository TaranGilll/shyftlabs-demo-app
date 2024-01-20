package helloworld;

import java.util.*;
import com.amazonaws.services.dynamodbv2.datamodeling.*;


@DynamoDBTable(tableName = "students-shyftlabs")
public class Course {
    private String itemType;
    private String uniqueId;
    private String courseName;
    private List<Student> courseStudents;

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

    @DynamoDBAttribute(attributeName = "courseName")
    public String getCourseName() {
        return courseName;
    }
    public void setCourseName(String courseName) {
        this.courseName = courseName;
    }

    @DynamoDBAttribute(attributeName = "courseStudents")
    public List<Student> getCourseStudents() {
        return courseStudents;
    }
    public void setCourseStudents(List<Student> courseStudents) {
        this.courseStudents = courseStudents;
    }
}