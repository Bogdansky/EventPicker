using Microsoft.EntityFrameworkCore;
using DAL.Entities;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DAL
{
    public class Context : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<Mark> Marks { get; set; }
        public DbSet<Coordinates> Coordinates { get; set; }
        public DbSet<Category> Categories { get; set; }
        
        public Context()
        {
            Database.EnsureCreated();
        }

        protected override void OnConfiguring(DbContextOptionsBuilder optionsBuilder)
        {
            string connectionString = new ConfigurationBuilder()
                                        .SetBasePath(Directory.GetCurrentDirectory())
                                        .AddJsonFile("appsettings.json")
                                        .Build()
                                        .GetConnectionString("MysqlConnection");
            optionsBuilder.UseMySQL(connectionString);
        }

        protected override void OnModelCreating(ModelBuilder modelBuilder)
        {
            modelBuilder.Entity<Mark>() // one-to-one
                .HasOne(m => m.Coordinates)
                .WithOne(c => c.Mark)
                .HasForeignKey<Coordinates>(c => c.MarkId)
                .OnDelete(DeleteBehavior.Restrict);
            modelBuilder.Entity<User>()
                .HasMany(u => u.Marks)
                .WithOne(m => m.User)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
