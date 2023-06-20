using BookMovieTickets.Models;
using BookMovieTickets.Views;
using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;

namespace BookMovieTickets.Services
{
    public interface IComboRepository
    {
        List<MessageVM> GetAll();
        MessageVM GetById(int id);
        List<MessageVM> GetComboByDateNow();
        MessageVM CreateCombo(ComboDTO dto);
        MessageVM UpdateCombo(ComboDTO dto, int id);
        MessageVM DeleteCombo(int id);
    }
}
