-- sqlite3 nodes.db
-- .tables
-- .quit
create table nono(name text)
drop table nono
insert into nodes(ipport, net) values("117.50.97.136:18037", "mainchain")
delete from nodes where status = "applied" and net = "mainchain" and ipport = "117.50.97.136:18037"

-- The reason why sqlite3 isn't tested here
-- is that it has to be built for electron
-- and couldn't be ran with node
