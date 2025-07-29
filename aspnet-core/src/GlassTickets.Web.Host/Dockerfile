FROM mcr.microsoft.com/dotnet/sdk:8.0 AS build

WORKDIR /src
COPY ["src/GlassTickets.Web.Host/GlassTickets.Web.Host.csproj", "src/GlassTickets.Web.Host/"]
COPY ["src/GlassTickets.Web.Core/GlassTickets.Web.Core.csproj", "src/GlassTickets.Web.Core/"]
COPY ["src/GlassTickets.Application/GlassTickets.Application.csproj", "src/GlassTickets.Application/"]
COPY ["src/GlassTickets.Core/GlassTickets.Core.csproj", "src/GlassTickets.Core/"]
COPY ["src/GlassTickets.EntityFrameworkCore/GlassTickets.EntityFrameworkCore.csproj", "src/GlassTickets.EntityFrameworkCore/"]
WORKDIR "/src/src/GlassTickets.Web.Host"
RUN dotnet restore 

WORKDIR /src
COPY ["src/GlassTickets.Web.Host", "src/GlassTickets.Web.Host"]
COPY ["src/GlassTickets.Web.Core", "src/GlassTickets.Web.Core"]
COPY ["src/GlassTickets.Application", "src/GlassTickets.Application"]
COPY ["src/GlassTickets.Core", "src/GlassTickets.Core"]
COPY ["src/GlassTickets.EntityFrameworkCore", "src/GlassTickets.EntityFrameworkCore"]
WORKDIR "/src/src/GlassTickets.Web.Host"
RUN dotnet publish -c Release -o /publish --no-restore

FROM mcr.microsoft.com/dotnet/aspnet:8.0
EXPOSE 80
WORKDIR /app
COPY --from=build /publish .
ENTRYPOINT ["dotnet", "GlassTickets.Web.Host.dll"]
