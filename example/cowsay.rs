use std::io::{self, Read};

fn main() -> std::io::Result<()> {
    let mut args = std::env::args().into_iter().collect::<Vec<String>>();
    let mut input = if args.len() > 1 {
        args.remove(0);
        args
    } else {
        let mut data = String::new();
        io::stdin().read_to_string(&mut data)?;
        data.split_ascii_whitespace().map(String::from).collect::<Vec<String>>()
    };

    let mut output = Vec::new();
    loop {
        let mut line = String::new();
        while !input.is_empty() {
            if input[0].len() > 40 {
                line += &input.remove(0);
                break;
            }
            if input[0].len() + line.len() > 40 {
                break;
            }
            line += " ";
            line += &input.remove(0);
        }
        output.push(line);
        if input.is_empty() {
            break;
        }
    }

    if output.len() == 1 {
        let len = output[0].len() + 1;
        println!(" {}", "_".repeat(len));
        println!("<{} >", output[0]);
        println!(" {}", "-".repeat(len));
    } else {
        let len = output[0].len();
        println!(" {}", "_".repeat(len + 1));
        for (i, v) in output.iter().enumerate() {
            println!(
                "{}{:width$} {}",
                if i == 0 {
                    "/"
                } else if i == output.len() - 1 {
                    "\\"
                } else {
                    "|"
                },
                v,
                if i == 0 {
                    "\\"
                } else if i == output.len() - 1 {
                    "/"
                } else {
                    "|"
                },
                width = len,
            );
        }
        println!(" {}", "-".repeat(len + 1));
    }

    println!(
"        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||");

    Ok(())
}
