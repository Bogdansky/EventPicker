using Microsoft.EntityFrameworkCore;
using DAL.Entities;
using Microsoft.Extensions.Configuration;
using System.IO;

namespace Reading_organizer.DAL
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
            modelBuilder.Entity<User>() // one-to-one
                .HasOne(u => u.UserInfo)
                .WithOne(ui => ui.User)
                .HasForeignKey<UserInfo>(ui => ui.UserId)
                .OnDelete(DeleteBehavior.Cascade);
            modelBuilder.Entity<User>()
                .HasMany(u => u.Progress)
                .WithOne(p => p.User)
                .HasForeignKey(p => p.UserId)
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
