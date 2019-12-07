using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;
using AutoMapper;
using BLL.DTO;
using DAL;
using Microsoft.EntityFrameworkCore;

namespace BLL.Services
{
    public class MarkService : IService<MarkDTO>
    {
        Context Context { get; set; }

        readonly IMapper mapper;

        public MarkService()
        {
            Context = new Context();
            var config = new MapperConfiguration(cfg => cfg.CreateMap<DAL.Entities.Mark, MarkDTO>()
                .ForMember(x => x.User, o => o.MapFrom(m => new UserDTO
                {
                    Id = m.User.Id,
                    Login = m.User.Login,
                    Nickname = m.User.Nickname
                }))
                .ForMember(x => x.Categories, o => o.MapFrom(m => m.Categories.Select(c => c.Id.ToString() + "_" + c.Name).Aggregate((x, y) => x + y))));
            mapper = config.CreateMapper();
        }

        public async Task<MarkDTO> Create(int userId, CoordinatesDTO obj)
        {
            try
            {
                var isExist = await Context.Marks.CountAsync(m => obj.Equals(m.Coordinates)) > 0;
                if (isExist)
                {
                    return null;
                }
                var user = await Context.Users.FindAsync(userId);
                if (user == null)
                {
                    return new MarkDTO
                    {
                        Id = -1
                    };
                }
                var mark = await Context.Marks.AddAsync(new DAL.Entities.Mark
                {
                    Coordinates = new DAL.Entities.Coordinates
                    {
                        Latitude = obj.Latitude,
                        Longitude = obj.Longitude
                    },
                    User = user
                });
                var result = await Context.SaveChangesAsync();
                return result == 0 ? null : new MarkDTO
                {
                    Id = mark.Entity.Id,
                    UserId = userId
                };
            }
            catch
            {
                return null;
            }
        }

        public async Task<MarkDTO> Delete(int markId, int userId)
        {
            var mark = await Context.Marks.Include(m => m.Coordinates).Where(m => m.Id == markId && m.UserId == userId).FirstOrDefaultAsync();
            if (mark == null)
            {
                return null;
            }
            _ = Context.Remove(mark.Coordinates);
            _ = Context.Remove(mark);
            return await Context.SaveChangesAsync() > 0 ? new MarkDTO() : null;
        }

        public Task<MarkDTO> Read(int id)
        {
            throw new NotImplementedException();
        }

        public async Task<IEnumerable<MarkDTO>> ReadAll()
        {
            try
            {
                var list = await Context.Marks.Include(m => m.Categories).Include(m => m.User).Include(m => m.Coordinates).AsNoTracking().ToListAsync();
                var result = list.Select(m => new MarkDTO
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    ImageUrl = m.ImageUrl,
                    User = new UserDTO
                    {
                        Nickname = m.User.Nickname
                    },
                    Categories = m.Categories == null || m.Categories.Count == 0 ? null : string.Join(",", m.Categories?.Select(c => c.Name)),
                    Coordinates = new CoordinatesDTO
                    {
                        Latitude = m.Coordinates.Latitude,
                        Longitude = m.Coordinates.Longitude
                    },
                    UserId = m.UserId.Value
                }).ToList();
                return result;
            }
            catch(Exception e)
            {
                return null;
            }
        }

        public async Task<object> ReadForView(int page = 0, int offset = 10)
        {
            try
            {
                var list = await Context.Marks.Include(m => m.Categories).Include(m => m.User).Include(m => m.Coordinates).AsNoTracking().ToListAsync();
                var result = list.Select(m => new
                {
                    Title = m.Title,
                    Description = m.Description,
                    Nickname = m.User.Nickname,
                    Categories = m.Categories == null || m.Categories.Count == 0 ? null : string.Join(",", m.Categories?.Select(c => c.Name)),
                    Coordinates = new CoordinatesDTO
                    {
                        Latitude = m.Coordinates.Latitude,
                        Longitude = m.Coordinates.Longitude
                    }
                }).Skip(offset * page).Take(offset).ToList();
                return result;
            }
            catch (Exception e)
            {
                return null;
            }
        }

        public async Task<IEnumerable<MarkDTO>> ReadAll(int id)
        {
            try
            {
                var array = await Context.Marks.Where(m => m.UserId == id).Include(m => m.Categories).Include(m => m.Coordinates).ToArrayAsync();
                //return mapper.Map<DAL.Entities.Mark[], MarkDTO[]>(array);
                return array.Select(m => new MarkDTO
                {
                    Id = m.Id,
                    Title = m.Title,
                    Description = m.Description,
                    ImageUrl = m.ImageUrl,
                    Categories = m.Categories == null || m.Categories.Count == 0 ? null : m.Categories?.Select(c => c.Id.ToString() + "_" + c.Name).Aggregate((x, y) => x + y),
                    Coordinates = new CoordinatesDTO
                    {
                        Latitude = m.Coordinates.Latitude,
                        Longitude = m.Coordinates.Longitude
                    },
                    UserId = id
                });
            }
            catch
            {
                return null;
            }
        }

        public async Task<int> Update(int id, MarkDTO obj)
        {
            var mark = await Context.Marks.Include(m => m.Categories).Where(m => m.Id == id).FirstOrDefaultAsync();
            if(mark == null)
            {
                return -1;
            }
            mark.Title = obj.Title ?? mark.Title;
            mark.Description = obj.Description ?? mark.Description;
            mark.ImageUrl = obj.ImageUrl ?? mark.ImageUrl;
            mark.Categories = obj.Categories.Split(",").Select(c => new DAL.Entities.Category
            {
                Name = c
            }).ToArray() ?? mark.Categories;

            return await Context.SaveChangesAsync();
        }

        public Task<MarkDTO> Create(MarkDTO obj)
        {
            throw new NotImplementedException();
        }

        public Task<MarkDTO> Delete(int id)
        {
            throw new NotImplementedException();
        }
    }
}
