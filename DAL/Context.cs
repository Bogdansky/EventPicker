using Microsoft.EntityFrameworkCore;
using DAL.Entities;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace DAL
{
    public class Context : DbContext
    {
        public DbSet<User> Users { get; set; }
        public DbSet<UserInfo> UserInfo { get; set; }
        public DbSet<Progress> Progress { get; set; }
        public DbSet<Task> Tasks { get; set; }
        public DbSet<Book> Books { get; set; }
        
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
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<User>()
                .HasMany(u => u.Marks)
                .WithOne(m => m.User)
                .HasForeignKey(m => m.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Book>() // one-to-many
                .HasMany(b => b.Progress)
                .WithOne(p => p.Book)
                .HasForeignKey(p => p.BookId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<Progress>() // one-to-one
                .HasOne(p => p.Task)
                .WithOne(t => t.Progress)
                .HasForeignKey<Task>(t => t.ProgressId)
                .OnDelete(DeleteBehavior.Cascade);
        }
    }
}
