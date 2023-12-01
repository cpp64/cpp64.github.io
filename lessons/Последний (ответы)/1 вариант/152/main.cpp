#include <iostream>

using namespace std;

int main()
{
    int a,b=0;
    cin >> a;
    while (a!=0)
    {
        if (((a-a%10)/10%10)%3==0 and a%2==0)
        {
            ++b;
        }
        cin >>a;
    }
    cout << b;
    return 0;
}
