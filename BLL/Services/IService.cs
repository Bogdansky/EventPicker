using System;
using System.Collections.Generic;
using System.Linq;
using System.Text;
using System.Threading.Tasks;

namespace BLL
{
    public interface IService<T>
    {
        Task<IEnumerable<T>> ReadAll();
        Task<T> Read(int id);
        Task<T> Create(T obj);
        Task<int> Update(int id, T obj);
        Task<T> Delete(int id);
    }
}