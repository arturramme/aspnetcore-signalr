using System.Threading.Tasks;
using Microsoft.AspNetCore.SignalR;
using Microsoft.AspNetCore.Authorization;

namespace aspnetcore_signalr 
{
    [Authorize]
    public class ChatHub : Hub 
    {
        public async Task Send(string message)
        {
            await Clients.All.SendAsync("ReceiveChatMessage", $"{Context.UserIdentifier}: {message}");
        }

        public async Task SendToUser(string user, string message)
        {
            await Clients.User(user).SendAsync("ReceiveDirectMessage", $"{Context.UserIdentifier}: {message}");    
        }
    }
}