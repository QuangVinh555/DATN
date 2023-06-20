using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IRoleRepository
    {
        List<MessageVM> GetAll();
        MessageVM GetById(int id);
        MessageVM CreateRole(RoleDTO dto);
        MessageVM UpdateRole(RoleDTO dto ,int id);
        MessageVM DeleteRole(int id);
        
    }
}
