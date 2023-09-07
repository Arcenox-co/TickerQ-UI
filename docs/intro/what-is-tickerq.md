# What is TickerQ?
In the expansive .NET ecosystem, TickerQ and its extension, TickerQ.EntityFrameworkCore, stand out as a powerful duo for managing background tasks and scheduled jobs. Together, they present a robust and extensible platform, facilitating seamless task queuing and execution. As applications grow in complexity and demand, this pair ensures scalability while preserving optimal performance.

<div class="tip custom-block" style="padding-top:8px;">
    <p>Just want to try it out? Skip to the 
        <a href="./getting-started">Quickstart</a>.
    </p>
</div>

## Main Package `TickerQ` 
TickerQ is not just another .NET library; it's a developer's gateway to hassle-free background task management. Purpose-built to queue and execute tasks efficiently, TickerQ keeps the main application thread clean, ensuring peak responsiveness. Its core strength lies in its ability to fortify .NET systems, making them resilient and scalable. While it inherently does not support time-based jobs, its design welcomes extensibility, allowing developers to expand its capabilities as needed.

## Extension Package `TickerQ.EntityFrameworkCore` 
Enter TickerQ.EntityFrameworkCore—an impeccable extension of TickerQ. For projects that demand time-based scheduling or need to work cohesively with load balancers, this package is indispensable. Offering the ability to store jobs in a database, it ensures that every job, along with its request data, is persistent and retrievable. Especially crucial for distributed systems, TickerQ.EntityFrameworkCore makes it possible to scale without losing the essence of task management, ensuring every job is processed, even in balanced load scenarios. In essence, it amplifies TickerQ's functionalities, making it a comprehensive solution for intricate task management requirements.
