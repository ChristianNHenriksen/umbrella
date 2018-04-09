# -*- mode: ruby -*-
# vi: set ft=ruby :

Vagrant.configure("2") do |config|
  config.vm.box = "bento/ubuntu-16.04"
  config.vm.synced_folder "~/.ssh", "/ssh"
  config.vm.provision "shell", inline: "mkdir -p ~/.ssh"
  config.vm.provision "shell", inline: "touch ~/.ssh/authorized_keys"
  config.vm.provision "shell", inline: "cat /ssh/*.pub >> ~/.ssh/authorized_keys"

  ### Build Server ###
  config.vm.define "Build Server" do |buildServer|
    buildServer.vm.network "private_network", ip: "1.1.1.100"
  end

end
