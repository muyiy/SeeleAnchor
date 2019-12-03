-- sqlite3 nodes.db
-- .tables 
-- .quit
create table nono(name text)
drop table nono
insert into nodes(ipport, net) values("117.50.97.136:18037", "mainchain")
delete from nodes where status = "applied" and net = "mainchain" and ipport = "117.50.97.136:18037"