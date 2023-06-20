using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface ITypeChairRepository
    {
        List<MessageVM> GetAll();
        MessageVM GetById(int id);
        MessageVM CreateTypeChair(TypeChairDTO dto);
        MessageVM UpdateTypeChair(TypeChairDTO dto, int id);
        MessageVM DeleteTypeChair(int id);
    }
}
