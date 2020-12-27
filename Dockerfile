# Sample Dockerfile

# Indicates that the windowsservercore image will be used as the base image.
FROM mcr.microsoft.com/dotnet/core/sdk:2.2

WORKDIR /src
COPY ["10977018_Test2/10977018_Test2.csproj" , "10977018_Test2/"]


RUN dotnet restore "10977018_Test2/10977018_Test2.csproj"

COPY . .
WORKDIR "/src"
RUN dotnet build "10977018_Test2/10977018_Test2.csproj" -c Release -o /app

RUN dotnet publish "10977018_Test2/10977018_Test2.csproj" -c Release -o /app

EXPOSE 80
WORKDIR /app
ENTRYPOINT ["dotnet" , "10977018_Test2.dll"]
