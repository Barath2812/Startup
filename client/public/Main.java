class ShapeCalculator
{
public int area(int side)
{
return side * side;
}
public int area(int length, int width)
{
return length * width;
}
public double area(double radius)
{
return Math.PI * radius * radius;
}
public double area(double base, double height)
{
return 0.5 * base * height;
}
}
public class Main
{
public static void main(String[] args)
{
ShapeCalculator calculator = new ShapeCalculator();
int squareSide = 4;
System.out.println("Area of square with side " + squareSide + ": " + calculator.area(squareSide));
int rectangleLength = 5;
int rectangleWidth = 3;
System.out.println("Area of rectangle with length " + rectangleLength + " and width " + rectangleWidth + ": " + calculator.area(rectangleLength, rectangleWidth));
double circleRadius = 2.5;
System.out.println("Area of circle with radius " + circleRadius + ": " + calculator.area(circleRadius));
double triangleBase = 6.0;
double triangleHeight = 4.0;
System.out.println("Area of triangle with base " + triangleBase + " and height " +triangleHeight + ": " + calculator.area(triangleBase, triangleHeight));
}
}
